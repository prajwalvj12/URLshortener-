import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  Input,
  VStack,
  useToast,
  Text,
  InputGroup,
  InputRightElement,
  useClipboard
} from '@chakra-ui/react';

const URLShortenerForm = ({ onUrlShortened }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState('');
  const toast = useToast();
  const { hasCopied, onCopy } = useClipboard(shortenedUrl);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) {
      toast({
        title: 'Error',
        description: 'Please enter a URL',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl: url }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setShortenedUrl(data.shortUrl);
      onUrlShortened(data);
      toast({
        title: 'Success',
        description: 'URL shortened successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to shorten URL',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} w="100%">
      <VStack spacing={4}>
        <FormControl>
          <Input
            type="url"
            placeholder="Enter your URL here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            size="lg"
          />
        </FormControl>

        <Button
          colorScheme="blue"
          isLoading={loading}
          type="submit"
          w="100%"
          size="lg"
        >
          Shorten URL
        </Button>

        {shortenedUrl && (
          <Box w="100%">
            <Text mb={2} fontWeight="bold">
              Shortened URL:
            </Text>
            <InputGroup size="md">
              <Input value={shortenedUrl} isReadOnly pr="4.5rem" />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={onCopy}>
                  {hasCopied ? 'Copied!' : 'Copy'}
                </Button>
              </InputRightElement>
            </InputGroup>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default URLShortenerForm;