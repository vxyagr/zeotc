import { Box } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import SimpleBarReact from 'simplebar-react';
// material

// ----------------------------------------------------------------------

const RootStyle = styled('div')({
  flexGrow: 1,
  height: '100%',
  overflow: 'hidden',
});

const SimpleBarStyle = styled(SimpleBarReact)(({ theme, }) => ({
  maxHeight: '100%',
  '& .simplebar-scrollbar': {
    '&:before': {
      background:
        ' linear-gradient(135deg, #C732A6 0%, #460AE4 100%, #C732A6 100%)',
    },
    '&.simplebar-visible:before': {
      opacity: 1,
    },
  },
  '& .simplebar-track.simplebar-vertical': {
    width: 12,
  },
  '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar': {
    height: 6,
  },
  '& .simplebar-mask': {
    zIndex: 'inherit',
  },
}));

// ----------------------------------------------------------------------


export default function Scrollbar({ children, sx, ...other }) {
  // const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  //   navigator.userAgent
  // );

  // if (isMobile) {
  //   return (
  //     <Box
  //        sx={{ overflowX: 'auto', ...sx, }}
  //        {...other}
  //     >
  //       {children}
  //     </Box>
  //   );
  // }

  return (
    <RootStyle>
      <SimpleBarStyle
        timeout={500}
        clickOnTrack={false}
        sx={sx}
        {...other}
      >
        {children}
      </SimpleBarStyle>
    </RootStyle>
  );
}
