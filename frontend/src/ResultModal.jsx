import { useState, useEffect } from "react";
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const ResultModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [result, setResult] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the behavioral form data from localStorage
    const data = localStorage.getItem("behavioralFormData");
    if (data) {
      const behavioralData = JSON.parse(data);
      let totalScore = 0;
      // Sum up the scores (assuming "1" for Yes and "0" for No)
      for (let key in behavioralData) {
        totalScore += parseInt(behavioralData[key], 10);
      }
      // Use a threshold to determine the result (adjust threshold as needed)
      if (totalScore >= 5) {
        setResult("Based on your responses, you may be on the autism spectrum.");
      } else {
        setResult("Based on your responses, it is unlikely that you are on the autism spectrum.");
      }
    } else {
      setResult("No behavioral data was found.");
    }
    onOpen();
  }, [onOpen]);

  const handleClose = () => {
    onClose();
    // Navigate to a home or another page when modal is closed
    navigate("/");
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Autism Screening Result</ModalHeader>
        <ModalBody>
          <Text>{result}</Text>
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
