import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { LANGUAGES_Versions } from "../constants";

// Convert object to array of [key, value] pairs
const languages = Object.entries(LANGUAGES_Versions);

const LanguageSelector = ({language,onSelect}) => {
  return (
    <Box >
      <Text mb={2} fontSize={"large"}>
        Language:
      </Text>
      <Menu>
        <MenuButton as={Button}>{language}</MenuButton>

        <MenuList >
          {languages.map(([language, version]) => (
            <MenuItem key={language} onClick={() => {
                onSelect(language);
              }}>
              {language}
              &nbsp;
              <Text as="span" color="gray.600" fontSize="sm">
                ({version})
              </Text>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default LanguageSelector;
