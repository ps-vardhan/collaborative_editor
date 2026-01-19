import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { Language_Versions } from "../constants";

const languages = Object.entries(Language_Versions);

const LanguageSelector = ({ language, onSelect }) => {
  return (
    <Box >
      {/* <Text mb={2} fontSize="lg">
        Select Language
      </Text> */}
      <Menu isLazy>
        <MenuButton as={Button}>{language}</MenuButton>

        <MenuList bg="#110c1b">
          {languages.map(([lang, version]) => (
            <MenuItem
              key={lang}
              color={lang === language ? "blue.400" : "white"}
              bg={lang === language ? "gray.900" : "transparent"}
              _hover={{
                bg: "gray.900",
                color: "blue.400",
              }}
              onClick={() => onSelect(lang)}
            >
              {lang}
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
