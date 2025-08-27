import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-key',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Check admin authorization
    const adminKey = req.headers.get('x-admin-key')
    const expectedAdminKey = Deno.env.get('BATCH_ADMIN_KEY')
    
    if (!adminKey || adminKey !== expectedAdminKey) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get batch parameters
    const { offset = 0, limit = 10 } = await req.json().catch(() => ({}))

    console.log(`Starting batch processing: offset=${offset}, limit=${limit}`)

    // Fetch users with required data
    const { data: users, error: fetchError } = await supabase
      .from('handly_users')
      .select('id, user_id, name, age, gender, dominant_hand, dominant_hand_image_url, non_dominant_hand_image_url')
      .not('dominant_hand_image_url', 'is', null)
      .not('name', 'is', null)
      .not('age', 'is', null)
      .not('gender', 'is', null)
      .not('dominant_hand', 'is', null)
      .range(offset, offset + limit - 1)

    if (fetchError) {
      console.error('Error fetching users:', fetchError)
      return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (!users || users.length === 0) {
      console.log('No more users to process')
      return new Response(JSON.stringify({ 
        message: 'No more users to process',
        processed: 0,
        hasMore: false
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`Processing ${users.length} users`)

    const results = []
    let processed = 0
    let errors = 0

    for (const user of users) {
      try {
        console.log(`Processing user ${user.id}: ${user.name}`)

        // Validate required fields
        if (!user.name || !user.age || !user.gender || !user.dominant_hand || !user.dominant_hand_image_url) {
          console.log(`Skipping user ${user.id}: missing required data`)
          results.push({ 
            userId: user.id, 
            status: 'skipped', 
            reason: 'missing required data' 
          })
          continue
        }

        // Check if images are still accessible
        const imageCheckResponse = await fetch(user.dominant_hand_image_url, { method: 'HEAD' })
        if (!imageCheckResponse.ok) {
          console.log(`Skipping user ${user.id}: dominant hand image not accessible`)
          results.push({ 
            userId: user.id, 
            status: 'skipped', 
            reason: 'dominant hand image not accessible' 
          })
          continue
        }

        // Optionally check non-dominant hand image if it exists
        if (user.non_dominant_hand_image_url) {
          const nonDominantImageCheck = await fetch(user.non_dominant_hand_image_url, { method: 'HEAD' })
          if (!nonDominantImageCheck.ok) {
            console.log(`Warning: non-dominant hand image not accessible for user ${user.id}, continuing with dominant hand only`)
            user.non_dominant_hand_image_url = null
          }
        }

        // Call the generate-palm-reading function
        const { data: palmReadingData, error: palmReadingError } = await supabase.functions.invoke('generate-palm-reading', {
          body: {
            name: user.name,
            age: user.age,
            gender: user.gender,
            dominant_hand: user.dominant_hand,
            dominant_hand_image: user.dominant_hand_image_url,
            non_dominant_hand_image: user.non_dominant_hand_image_url
          }
        })

        if (palmReadingError) {
          console.error(`Palm reading generation failed for user ${user.id}:`, palmReadingError)
          results.push({ 
            userId: user.id, 
            status: 'error', 
            reason: 'palm reading generation failed',
            error: palmReadingError.message 
          })
          errors++
          continue
        }

        if (!palmReadingData?.reading) {
          console.error(`No reading returned for user ${user.id}`)
          results.push({ 
            userId: user.id, 
            status: 'error', 
            reason: 'no reading returned' 
          })
          errors++
          continue
        }

        // Update the user's reading result
        const { error: updateError } = await supabase
          .from('handly_users')
          .update({ 
            reading_result: palmReadingData.reading,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)

        if (updateError) {
          console.error(`Failed to update user ${user.id}:`, updateError)
          results.push({ 
            userId: user.id, 
            status: 'error', 
            reason: 'database update failed',
            error: updateError.message 
          })
          errors++
          continue
        }

        console.log(`Successfully updated user ${user.id}`)
        results.push({ 
          userId: user.id, 
          status: 'success' 
        })
        processed++

      } catch (error) {
        console.error(`Unexpected error processing user ${user.id}:`, error)
        results.push({ 
          userId: user.id, 
          status: 'error', 
          reason: 'unexpected error',
          error: error.message 
        })
        errors++
      }
    }

    // Check if there are more users to process
    const { count: totalCount } = await supabase
      .from('handly_users')
      .select('id', { count: 'exact', head: true })
      .not('dominant_hand_image_url', 'is', null)
      .not('name', 'is', null)
      .not('age', 'is', null)
      .not('gender', 'is', null)
      .not('dominant_hand', 'is', null)

    const hasMore = (offset + limit) < (totalCount || 0)

    console.log(`Batch complete: processed=${processed}, errors=${errors}, hasMore=${hasMore}`)

    return new Response(JSON.stringify({
      message: `Batch processing complete`,
      processed,
      errors,
      total: users.length,
      hasMore,
      nextOffset: hasMore ? offset + limit : null,
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Batch processing error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})