import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  useColorModeValue
} from '@chakra-ui/react';

const URLAnalytics = ({ urls }) => {
  const [analytics, setAnalytics] = useState({});
  const bgColor = useColorModeValue('white', 'gray.700');

  const fetchAnalytics = async (shortId) => {
    try {
      const response = await fetch(`http://localhost:3000/analytics/${shortId}`);
      const data = await response.json();
      setAnalytics(prev => ({
        ...prev,
        [shortId]: data
      }));
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  useEffect(() => {
    // Initial fetch for all URLs
    urls.forEach(url => {
      if (url.shortId && !analytics[url.shortId]) {
        fetchAnalytics(url.shortId);
      }
    });

    // Set up periodic refresh for all URLs
    const intervalId = setInterval(() => {
      urls.forEach(url => {
        if (url.shortId) {
          fetchAnalytics(url.shortId);
        }
      });
    }, 5000); // Refresh every 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [urls]);

  if (urls.length === 0) {
    return null;
  }

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="lg" mb={4}>URL Analytics</Heading>

      {urls.map((url) => {
        const urlAnalytics = analytics[url.shortId] || { clicks: 0, analytics: [] };

        return (
          <Box
            key={url.shortId}
            bg={bgColor}
            p={6}
            borderRadius="lg"
            shadow="md"
            mb={4}
          >
            <VStack align="stretch" spacing={4}>
              <Box>
                <Text fontWeight="bold" fontSize="md" mb={2}>
                  Original URL: {url.originalUrl}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Short URL: {url.shortUrl}
                </Text>
              </Box>

              <StatGroup>
                <Stat>
                  <StatLabel>Total Clicks</StatLabel>
                  <StatNumber>{urlAnalytics.clicks}</StatNumber>
                </Stat>
              </StatGroup>

              {urlAnalytics.analytics && urlAnalytics.analytics.length > 0 && (
                <Box overflowX="auto">
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Timestamp</Th>
                        <Th>Referrer</Th>
                        <Th>User Agent</Th>
                        <Th>IP Address</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {urlAnalytics.analytics.map((entry, index) => (
                        <Tr key={index}>
                          <Td>{new Date(entry.timestamp).toLocaleString()}</Td>
                          <Td>
                            <Badge colorScheme="blue">
                              {entry.referrer || 'Direct'}
                            </Badge>
                          </Td>
                          <Td>{entry.userAgent}</Td>
                          <Td>{entry.ipAddress}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </VStack>
          </Box>
        );
      })}
    </VStack>
  );
};

export default URLAnalytics;