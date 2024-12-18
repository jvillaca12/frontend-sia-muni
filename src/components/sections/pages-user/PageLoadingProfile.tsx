import { ReactElement } from 'react';
import PageUserProfile from './PageUserProfile';
import { Box } from '@mui/material';

const ChatBotPage = (): ReactElement => {
  return (
    <>
      <Box>
        <PageUserProfile />
      </Box>
    </>
  );
};

export default ChatBotPage;