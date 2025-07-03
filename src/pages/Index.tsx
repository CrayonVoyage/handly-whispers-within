
import HandlyForm from "@/components/HandlyForm";
import ErrorBoundary from "@/components/ErrorBoundary";

const Index = () => {
  console.log('Index component rendering...');
  
  return (
    <ErrorBoundary>
      <HandlyForm />
    </ErrorBoundary>
  );
};

export default Index;
