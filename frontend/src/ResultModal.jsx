import { useState, useEffect } from "react";
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const ResultModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve data from localStorage
    const behavioralData = JSON.parse(localStorage.getItem("behavioralFormData"));
    const personalInfo = JSON.parse(localStorage.getItem("personalInfo"));

    if (behavioralData && personalInfo) {
      // Convert behavioral scores to integers
      const convertedBehavioralData = {};
      for (let i = 1; i <= 10; i++) {
        const score = parseInt(behavioralData[`A${i}_Score`], 10);
        convertedBehavioralData[`A${i}_Score`] = isNaN(score) ? 0 : score;
      }

      // Map personal info and convert values to expected types
      const mappedPersonalInfo = {
        age: isNaN(parseFloat(personalInfo.age))
          ? 0
          : parseFloat(personalInfo.age),
        gender: personalInfo.gender || "",
        ethnicity: personalInfo.ethnicity || "",
        // Convert to booleans (adjust if your backend expects strings)
        jaundice: personalInfo.jaundice === "yes",
        autism: personalInfo.autism === "yes",
        // Ensure key matches the model exactly
        country_of_residence: personalInfo.country_of_residence || "",
        used_app_before: personalInfo.used_app_before === "yes",
        relation: personalInfo.relation === "self" ? "parent" : (personalInfo.relation || ""),
      };

      // Build payload without extra fields
      const payload = {
        ...convertedBehavioralData,
        ...mappedPersonalInfo,
      };

      // Debug: Log the payload to see what’s being sent
      console.log("Payload to be sent:", payload);

      fetch("http://localhost:8000/autism_prediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((errData) => {
              console.error("Backend error detail:", errData);
              throw new Error("Network response was not ok");
            });
          }
          return res.json();
        })
        .then((data) => {
          setResult(`${data.prediction} (${data.probability_percentage})`);
          setLoading(false);
          onOpen();
        })
        .catch((error) => {
          console.error("Error fetching prediction:", error);
          setResult("An error occurred while fetching the prediction.");
          setLoading(false);
          onOpen();
        });
    } else {
      setResult("Required form data not found. Please complete both forms.");
      setLoading(false);
      onOpen();
    }
  }, [onOpen]);

  const handleClose = () => {
    onClose();
    navigate("/");
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Autism Screening Result</ModalHeader>
        <ModalBody>
          {loading ? (
            <>
              <Spinner size="xl" />
              <Text mt={4}>Fetching prediction...</Text>
            </>
          ) : result.toLowerCase().includes("error") ||
            result.toLowerCase().includes("not found") ? (
            <Alert status="error">
              <AlertIcon />
              {result}
            </Alert>
          ) : (
            <Text>{result}</Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ResultModal;
