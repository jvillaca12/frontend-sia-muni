import { ReactElement } from 'react';
import { Link, Stack, Button, Typography } from '@mui/material';
import Image from 'components/base/Image';
import errorSvg from 'assets/images/error/error.svg';
import UserService from 'data/services/UserService';
import { useNavigate } from 'react-router-dom';

const ErrorPage = (): ReactElement => {
  const navigate = useNavigate();
  const handleLogout = () => {
    UserService.logout(navigate);
  };
  return (
    <Stack
      minHeight="100vh"
      width="fit-content"
      mx="auto"
      justifyContent="center"
      alignItems="center"
      gap={10}
      py={12}
    >
      <Typography variant="h1" color="text.secondary">
        Oops! Página no encontrada!
      </Typography>
      <Typography
        variant="h5"
        fontWeight={400}
        color="text.primary"
        maxWidth={600}
        textAlign="center"
      >
        No hemos podido localizar la página a la que intenta acceder. Disculpe las molestias que
        esto le haya podido ocasionar. Gracias por su comprensión.!
      </Typography>
      <Image
        alt="Not Found Image"
        src={errorSvg}
        sx={{
          mx: 'auto',
          height: 260,
          my: { xs: 5, sm: 10 },
          width: { xs: 1, sm: 340 },
        }}
      />
      <Button onClick={handleLogout} size="large" variant="contained" component={Link}>
        Regresar al login
      </Button>
    </Stack>
  );
};

export default ErrorPage;
