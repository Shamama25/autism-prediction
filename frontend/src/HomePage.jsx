import React, { useState } from "react";
import {
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Card,
  CardBody,
  CardFooter,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { CheckIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { FaUser, FaBirthdayCake } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  // State variables for form inputs and error messages
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [nameError, setNameError] = useState("");
  const [ageError, setAgeError] = useState("");

  // Create a navigate function
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset errors
    setNameError("");
    setAgeError("");

    let valid = true;

    // Name validation (not empty, length >= 4)
    if (!name) {
      setNameError("Name is required.");
      valid = false;
    } else if (name.length < 4) {
      setNameError("Name should be valid!!");
      valid = false;
    }

    // Age validation (>= 18, <= 100)
    if (!age) {
      setAgeError("Age is required.");
      valid = false;
    } else if (isNaN(age) || age < 18 || age > 100) {
      setAgeError("Please enter a valid age!!");
      valid = false;
    }

    // If valid, navigate to Questionaries.jsx
    if (valid) {
      console.log("Form submitted with Name:", name, "Age:", age);
      navigate("/behavioral-questions"); // Redirect to the Questionaries page
    }
  };

  // Split text into individual letters for animation
  const titleText = "Welcome to the Autism Detection Hub";
  const letters = titleText.split("");

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen p-6">
      {/* Content Container */}
      <div className="flex flex-row items-center justify-center w-full p-6">
        {/* Left Side - Image */}
        <div className="flex-1 hidden md:block">
          <img
            src="/autism.png" // Replace with your image path
            alt="Autism Detection"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 p-6 bg-white">
          {/* Add motion.div here for animated title */}
          <Heading lineHeight="tall" textAlign="center" mb={6} color="#2377c6">
            {/* Map over letters and animate each one */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {letters.map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.3,
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>
          </Heading>

          <Card
            boxShadow="lg"
            borderRadius="md"
            p={6}
            maxWidth="400px"
            bg="white"
            mx="auto"
          >
            <CardBody>
              <Stack spacing={6}>
                {/* Name Input */}
                <FormControl isInvalid={nameError}>
                  <FormLabel>Name</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FaUser color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Enter your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      width="100%"
                      bg="gray.50"
                      borderRadius="md"
                      boxShadow="sm"
                      _hover={{ borderColor: "teal.500" }}
                      _focus={{ borderColor: "teal.500", boxShadow: "md" }}
                    />
                    <InputRightElement>
                      <CheckIcon color="green.500" />
                    </InputRightElement>
                  </InputGroup>
                  {nameError && (
                    <FormErrorMessage>{nameError}</FormErrorMessage>
                  )}
                </FormControl>

                {/* Age Input */}
                <FormControl isInvalid={ageError}>
                  <FormLabel>Age</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FaBirthdayCake color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Enter your age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      width="100%"
                      bg="gray.50"
                      borderRadius="md"
                      boxShadow="sm"
                      _hover={{ borderColor: "teal.500" }}
                      _focus={{ borderColor: "teal.500", boxShadow: "md" }}
                    />
                    <InputRightElement>
                      <CheckIcon color="green.500" />
                    </InputRightElement>
                  </InputGroup>
                  {ageError && <FormErrorMessage>{ageError}</FormErrorMessage>}
                </FormControl>
              </Stack>
            </CardBody>
            <CardFooter display="flex" justifyContent="center">
              <Button
                rightIcon={<ArrowForwardIcon />}
                bg="#2377c6"
                color="white"
                _hover={{ bg: "#1e66a8" }} 
                width="100%"
                onClick={handleSubmit}
              >
                Continue
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
