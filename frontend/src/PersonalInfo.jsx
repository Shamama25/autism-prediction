import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardFooter,
  Button,
  Select,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  SimpleGrid,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

const PersonalInfo = () => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    ethnicity: "",
    jaundice: "",
    autism: "",
    country_of_residence: "",
    used_app_before: "",
    relation: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    // Validate if all fields have values
    const isValid = Object.values(formData).every((field) => field !== "");

    if (!isValid) {
      setError("Please fill in all the fields.");
      return;
    }

    setError(null);
    localStorage.setItem("personalInfo", JSON.stringify(formData));
    navigate("/result-modal");
  };

  return (
    // Same outer divs as in BehavioralQuestions
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 px-82 py-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl mx-auto border-2 border-gray-300">
        <h1 className="text-4xl text-center mb-8 font-extrabold text-gray-800">
          Personal Information
        </h1>

        {/* Changed this container to a SimpleGrid for two fields per row */}
        <SimpleGrid columns={2} spacing={4} className="w-[90vh]">
          <FormControl mb={4} isInvalid={error && formData.age === ""}>
            <FormLabel fontSize="lg" color="gray.700" fontWeight="medium" mb={2}>
              Age
            </FormLabel>
            <Input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
              size="md"
              variant="filled"
              focusBorderColor="blue.400"
              bg="#F5F5F5"
              _hover={{ bg: "#EDEDED" }}
              _focus={{ bg: "#EDEDED" }}
              borderColor="gray.300"
            />
            {error && formData.age === "" && (
              <FormErrorMessage>Please enter your age.</FormErrorMessage>
            )}
          </FormControl>

          <FormControl mb={4} isInvalid={error && formData.gender === ""}>
            <FormLabel fontSize="lg" color="gray.700" fontWeight="medium" mb={2}>
              Gender
            </FormLabel>
            <Select
              name="gender"
              value={formData.gender}
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
              <option value="m">Male</option>
              <option value="f">Female</option>
            </Select>
            {error && formData.gender === "" && (
              <FormErrorMessage>Please select your gender.</FormErrorMessage>
            )}
          </FormControl>

          <FormControl mb={4} isInvalid={error && formData.ethnicity === ""}>
            <FormLabel fontSize="lg" color="gray.700" fontWeight="medium" mb={2}>
              Ethnicity
            </FormLabel>
            <Select
              name="ethnicity"
              value={formData.ethnicity}
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
              <option value="White-European">White-European</option>
              <option value="Asian">Asian</option>
              <option value="Black">Black</option>
              <option value="Hispanic">Hispanic</option>
              <option value="Other">Other</option>
            </Select>
            {error && formData.ethnicity === "" && (
              <FormErrorMessage>Please select your ethnicity.</FormErrorMessage>
            )}
          </FormControl>

          <FormControl mb={4} isInvalid={error && formData.jaundice === ""}>
            <FormLabel fontSize="lg" color="gray.700" fontWeight="medium" mb={2}>
              Jaundice at Birth
            </FormLabel>
            <Select
              name="jaundice"
              value={formData.jaundice}
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
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Select>
            {error && formData.jaundice === "" && (
              <FormErrorMessage>Please choose an option.</FormErrorMessage>
            )}
          </FormControl>

          <FormControl mb={4} isInvalid={error && formData.autism === ""}>
            <FormLabel fontSize="lg" color="gray.700" fontWeight="medium" mb={2}>
              Family Member with Autism
            </FormLabel>
            <Select
              name="autism"
              value={formData.autism}
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
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Select>
            {error && formData.autism === "" && (
              <FormErrorMessage>Please choose an option.</FormErrorMessage>
            )}
          </FormControl>

          <FormControl
            mb={4}
            isInvalid={error && formData.country_of_residence === ""}
          >
            <FormLabel fontSize="lg" color="gray.700" fontWeight="medium" mb={2}>
              Country of Residence
            </FormLabel>
            <Input
              type="text"
              name="country_of_residence"
              value={formData.country_of_residence}
              onChange={handleChange}
              placeholder="Enter your country"
              size="md"
              variant="filled"
              focusBorderColor="blue.400"
              bg="#F5F5F5"
              _hover={{ bg: "#EDEDED" }}
              _focus={{ bg: "#EDEDED" }}
              borderColor="gray-300"
            />
            {error && formData.country_of_residence === "" && (
              <FormErrorMessage>Please enter your country.</FormErrorMessage>
            )}
          </FormControl>

          <FormControl
            mb={4}
            isInvalid={error && formData.used_app_before === ""}
          >
            <FormLabel fontSize="lg" color="gray.700" fontWeight="medium" mb={2}>
              Used Screening App Before
            </FormLabel>
            <Select
              name="used_app_before"
              value={formData.used_app_before}
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
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Select>
            {error && formData.used_app_before === "" && (
              <FormErrorMessage>Please choose an option.</FormErrorMessage>
            )}
          </FormControl>

          <FormControl mb={4} isInvalid={error && formData.relation === ""}>
            <FormLabel fontSize="lg" color="gray.700" fontWeight="medium" mb={2}>
              Relation
            </FormLabel>
            <Select
              name="relation"
              value={formData.relation}
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
              <option value="self">Self</option>
              <option value="parent">Parent</option>
              <option value="caregiver">Caregiver</option>
              <option value="medical_staff">Medical Staff</option>
              <option value="relative">Relative</option>
            </Select>
            {error && formData.relation === "" && (
              <FormErrorMessage>Please choose an option.</FormErrorMessage>
            )}
          </FormControl>
        </SimpleGrid>

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
              Submit for Analysis
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PersonalInfo;
