import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const ErrorAlert = () => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="w-4 h-4" />
      <AlertTitle>Bummer!</AlertTitle>
      <AlertDescription>Something terrible happened!</AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;
