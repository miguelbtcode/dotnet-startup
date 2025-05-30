import React from 'react';
import {
  Box,
  Button,
  Code,
  HStack,
  useClipboard,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useProjectStore } from '../store/projectStore';
import { Download, Copy } from 'lucide-react';

export const JsonOutput: React.FC = () => {
  const { config } = useProjectStore();
  const toast = useToast();
  const { onCopy } = useClipboard(JSON.stringify(config, null, 2));

  const handleCopy = () => {
    onCopy();
    toast({
      title: 'Copied to clipboard',
      status: 'success',
      duration: 2000,
    });
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.name}-config.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Box bg="white" p={6} rounded="lg" shadow="md">
      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between">
          <Button leftIcon={<Copy size={16} />} onClick={handleCopy}>
            Copy JSON
          </Button>
          <Button leftIcon={<Download size={16} />} onClick={handleDownload}>
            Download
          </Button>
        </HStack>
        <Box overflowX="auto">
          <Code display="block" whiteSpace="pre" p={4}>
            {JSON.stringify(config, null, 2)}
          </Code>
        </Box>
      </VStack>
    </Box>
  );
};