import React, { useState } from 'react';
import { ChakraProvider, Box, VStack, Container, Heading } from '@chakra-ui/react';
import URLShortenerForm from './components/URLShortenerForm';
import URLAnalytics from './components/URLAnalytics';

function App() {
  const [shortenedUrls, setShortenedUrls] = useState([]);

  const handleUrlShortened = (urlData) => {
    setShortenedUrls([urlData, ...shortenedUrls]);
  };

  return (
    <ChakraProvider>
      <Box minH="100vh" bg="gray.50" py={10}>
        <Container maxW="container.lg">
          <VStack spacing={8} align="stretch">
            <Heading textAlign="center" size="xl" color="blue.600">
              URL Shortener
            </Heading>
            <URLShortenerForm onUrlShortened={handleUrlShortened} />
            <URLAnalytics urls={shortenedUrls} />
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;