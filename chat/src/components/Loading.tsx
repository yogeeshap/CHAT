import LinearProgress from '@mui/material/LinearProgress';
import Logo from './Logo';
import { motion } from 'framer-motion'
import { Box } from '@mui/material';

const MotionBox = motion(Box)

export function Loading() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="85vh"
      minWidth="100vw"
    >
      <MotionBox
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
        mb={2}
      >
        <Logo className="w-24" />
      </MotionBox>

      <Box width="15rem">
        <LinearProgress />
      </Box>
    </Box>
  );
}
