import * as React from "react";
import {
  ChakraProvider,
  Box,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
} from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
  useLocation,
} from "react-router-dom";
import HomePage from "./HomePage";
import BehavioralQuestions from "./BehavioralQuestions";
import PersonalInfo from "./PersonalInfo";
import ResultModal from "./ResultModal";

// Define the steps with titles and descriptions
const steps = [
  { title: "Contact Info", description: "Enter Name and Age" },
  { title: "Behavioral", description: "Answer Behavioral Questions" },
  { title: "Personal", description: "Enter Personal Info" },
];

// Layout component that includes the stepper (except on homepage and result page)
function StepLayout() {
  const location = useLocation();
  let activeStep = 0;

  if (location.pathname === "/") {
    activeStep = 0;
  } else if (location.pathname.includes("behavior")) {
    activeStep = 1;
  } else if (location.pathname.includes("personal")) {
    activeStep = 2;
  }

  return (
    <Box p={4}>
      {/* Render the stepper only if not on the homepage or result page */}
      {location.pathname !== "/" && location.pathname !== "/result-modal" && (
        <Stepper index={activeStep} size="lg" mb={8} w="90%">
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon color="white" />}
                  incomplete={<StepNumber color="#2377c6" />}
                  active={<StepNumber color="#2377c6" />}
                />
              </StepIndicator>
              <Box flexShrink="0">
                <StepTitle color="#2377c6">{step.title}</StepTitle>
                <StepDescription color="#2377c6">
                  {step.description}
                </StepDescription>
              </Box>
              <StepSeparator borderColor="#2377c6" />
            </Step>
          ))}
        </Stepper>
      )}
      {/* Render the current page */}
      <Outlet />
    </Box>
  );
}

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          {/* Use the StepLayout as the parent layout for all steps */}
          <Route path="/" element={<StepLayout />}>
            <Route index element={<HomePage />} />
            <Route
              path="behavioral-questions"
              element={<BehavioralQuestions />}
            />
            <Route path="personal-info" element={<PersonalInfo />} />
            <Route path="result-modal" element={<ResultModal />} />
          </Route>
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
