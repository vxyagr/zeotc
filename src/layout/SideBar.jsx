import * as React from 'react';

import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled, useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { useRouter } from 'next/router';

import useResponsive from 'hooks/useResponsive';

import Navbar from './Navbar';

const drawerWidth = 254;

const LIST_ITEMS = [
  {
    id: 1,
    title: 'Marketplace',
    icon: '/assets/svg/MarketPlace.svg',
    link: '/'
  },
  {
    id: 2,
    title: 'Create OTC Trade',
    icon: '/assets/svg/Otc.svg',
    link: '/dashboard'
  },
  {
    id: 3,
    title: 'My OTC Trades',
    icon: '/assets/svg/MyOtc.svg',
    link: '/myOtcTrades'
  },
  {
    id: 4,
    title: 'My Assets',
    icon: '/assets/svg/MyAssets.svg',
    link: '/myAssets'
  }
];
// swapOfferDetails
const openedMixin = (theme) => ({
  width: drawerWidth,
  height: '70vh',
  marginTop: '12.5vh',
  marginLeft: 20,
  background: theme.info,
  borderRadius: 11,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden',

  [theme.breakpoints.down('md')]: {
    // width: `calc(${theme.spacing(8)} + 1px)`,
    // width:0,
    background: '#000',
    // border:0
    height: '100vh',
    marginTop: 0,

    marginLeft: 15
  }
});

const closedMixin = (theme) => ({
  height: '70vh',
  marginTop: '12.5vh',
  borderRadius: 11,
  marginLeft: 20,
  background: theme.info,

  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,

  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  },
  [theme.breakpoints.down('md')]: {
    // width: `calc(${theme.spacing(8)} + 1px)`,
    width: 0,
    background: '#000',
    border: 0,
    height: '100vh',
    // marginTop: 30,
    marginLeft: 15
  }
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  // justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  [theme.breakpoints.down('md')]: {
    // width: `calc(${theme.spacing(8)} + 1px)`,
    // width:0,
    background: '#000',
    // border:0
    marginLeft: 15,
    display: 'none'
  }
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  // whiteSpace: 'nowrap',
  // boxSizing: 'border-box',
  ...(open && {
    // ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme)
  }),
  ...(!open && {
    // ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme)
  })
}));

export default function SideDrawer({ setIsOpen }) {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useResponsive('down', 'md');

  let pathname = router?.pathname?.split('/');
  pathname = `/${pathname?.[1]}`;

  const [open, setOpen] = React.useState(true);
  const [clickOpen, setClickOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  // const MouseHover = () => {
  //   setClickOpen(!clickOpen);
  // };

  // React.useEffect(() => {
  //   if (clickOpen) {
  //     setIsOpen(clickOpen);
  //   } else {
  //     setIsOpen(open);
  //   }
  // }, [open, clickOpen, setIsOpen]);
  React.useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  return (
    <Box
      sx={{
        display: 'block',
        width: '100%'
      }}
    >
      <ClickAwayListener
        onClickAway={() => {
          isMobile && handleDrawerClose();
        }}
      >
        <Box>
          <Box
            sx={{
              flexGrow: 0,
              width: '100%'
            }}
          >
            <Navbar
              handleDrawerOpen={open ? handleDrawerClose : handleDrawerOpen}
            />
          </Box>

          <Drawer
            variant='permanent'
            // open={clickOpen ? clickOpen : open}
            open={open}
            // onMouseEnter={MouseHover}
            // onMouseLeave={MouseHover}
          >
            <DrawerHeader>
              <IconButton
                color='inherit'
                aria-label='open drawer'
                // onClick={handleDrawerOpen}
                // edge="start"
                sx={{
                  // marginRight: 5,
                  // mx: open || clickOpen ? 0 : 'auto',
                  mx: open ? 0 : 'auto'
                  // ...(open && { display: 'none' }),
                }}
              >
                <MenuIcon />
              </IconButton>
            </DrawerHeader>

            <List>
              {LIST_ITEMS.map((text, idx) => (
                <ListItem
                  key={text.title}
                  disablePadding
                  sx={{
                    display: 'block',
                    fontSize: '14px'
                  }}
                >
                  <ListItemButton
                    component={Link}
                    href={`${text?.link}`}
                    sx={{
                      minHeight: 48,
                      // justifyContent: open || clickOpen ? 'initial' : 'center',
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      py: 1.5
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        // mr: open || clickOpen ? 3 : 'auto',
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center'
                      }}
                    >
                      <Box
                        sx={{
                          background:
                            pathname === text.link
                              ? ' linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #460AE4 100%)'
                              : '#3636364d',
                          borderRadius: '11px'
                        }}
                      >
                        <Box
                          component='img'
                          src={text.icon}
                          sx={{
                            p: text.id === 2 ? 1 : 1.5,
                            borderRadius: '11px',
                            width: 45,
                            background:
                              pathname === 'swapOfferDetails' &&
                              idx === 2 &&
                              'linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #460AE4 100%)'
                          }}
                        />
                      </Box>
                    </ListItemIcon>

                    <ListItemText
                      primary={text.title}
                      sx={{
                        // display: open || clickOpen ? 'block' : 'none',
                        display: open ? 'block' : 'none',
                        height: 30
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Drawer>

          <Box component='main'>
            <DrawerHeader />
          </Box>
        </Box>
      </ClickAwayListener>
    </Box>
  );
}
