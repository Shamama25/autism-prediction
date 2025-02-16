import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardFooter,
  Button,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

const BehavioralQuestions = () => {
  const [formData, setFormData] = useState({
    A1_Score: "",
    A2_Score: "",
    A3_Score: "",
    A4_Score: "",
    A5_Score: "",
    A6_Score: "",
    A7_Score: "",
    A8_Score: "",
    A9_Score: "",
    A10_Score: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    // Check if all questions have been answered
    const isValid = Object.values(formData).every((score) => score !== "");

    if (!isValid) {
      setError("Please answer all the questions.");
      return;
    }

    setError(null); // Clear any previous error
    localStorage.setItem("behavioralFormData", JSON.stringify(formData));
    navigate("/personal-info");
  };

  const questions = [
    "I often notice small sounds when others do not",
    "I usually concentrate more on the whole picture, rather than small details",
    "I find it easy to do more than one thing at once",
    "If there is an interruption, I can switch back to what I was doing very quickly",
    "I find it easy to 'read between the lines' when someone is talking to me",
    "I know how to tell if someone listening to me is getting bored",
    "When I'm reading a story, I find it difficult to work out the characters' intentions",
    "I like to collect information about categories of things",
    "I find it easy to work out what someone is thinking or feeling",
    "I find it difficult to work out people's intentions",
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 px-64 py-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl mx-auto border-2 border-gray-300">
        <h1 className="text-4xl text-center mb-8 font-extrabold text-gray-800">
          Behavioral Questions
        </h1>

        <div>
          {questions.map((question, index) => (
            <FormControl
              key={index}
              mb={4}
              isInvalid={error && formData[`A${index + 1}_Score`] === ""}
            >
              <FormLabel fontSize="lg" color="gray.700" fontWeight="medium" mb={2}>
                {`A${index + 1}: ${question}`}
                <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                name={`A${index + 1}_Score`}
                value={formData[`A${index + 1}_Score`]}
                onChange={handleChange}
                placeholder="Choose..."
                size="md"
                variant="filled"
                focusBorderColor="blue.400"
                bg="#F5F5F5"
                _hover={{ bg: "#EDEDED" }}
                _focus={{ bg: "#EDEDED" }}
                borderColor="gray-300"
              >
                <option value="1">Yes</option>
                <option value="0">No</option>
              </Select>
              {error && formData[`A${index + 1}_Score`] === "" && (
                <FormErrorMessage>Please choose an option.</FormErrorMessage>
              )}
            </FormControl>
          ))}
        </div>

        {error && (
          <p className="text-red-500 mt-4 text-center font-semibold">{error}</p>
        )}

        <Card mt={8}>
          <CardFooter display="flex" justifyContent="center">
            <Button
              rightIcon={<ArrowForwardIcon />}
              p={6}
              borderRadius="md"
              bg="#2377c6"
              color="white"
              _hover={{ bg: "#1e66a8" }}
              onClick={handleNext}
            >
              Continue
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default BehavioralQuestions;
