import { useState } from 'react';

import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

import OfferCard from '../card/OfferCard';
import Scrollbar from '../Scrollbar';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 954,
  width: '100%',
  bgcolor: '#0A0A0A',
  border: '0px solid #0A0A0A',
  boxShadow: ' 0px 0px 19.9613px 4.33941px rgba(253, 45, 255, 0.1)',
  borderRadius: '14.754px',
  outline: 'none',
  height: {
    xs: '90vh',
    sm: '70vh'
  },
  overflow: 'auto',
  p: 4
};

const TAB_OPTIONS = ['Token', 'NFTs', 'Custom'];

const OFFERS_DATA = [
  {
    id: 1,
    title: 'Ethereum',
    price: '$1,348.67',
    value: 'Amount',
    status: 'Available',
    img: '/assets/images/ethereum.png'
  },
  {
    id: 2,
    title: 'Bitcoin',
    price: '$19,384.47',
    value: 'Amount',
    status: 'Available',
    img: '/assets/images/Bitcoin.png'
  },
  {
    id: 3,
    title: 'USDC',
    price: '$0.999149',
    value: 'Amount',
    status: 'Available',
    img: '/assets/images/Dollar.png'
  },
  {
    id: 4,
    title: 'BNB',
    price: '$274.41',
    value: '152',
    status: 'Not available',
    img: '/assets/images/Bnb.png'
  },
  {
    id: 5,
    title: 'USDC',
    price: '$0.999149',
    value: 'Amount',
    status: 'Available',
    img: '/assets/images/Dollar.png'
  },
  {
    id: 6,
    title: 'BNB',
    price: '$274.41',
    value: '152',
    status: 'Not available',
    img: '/assets/images/Bnb.png'
  }
];

export default function CounterOffer({ handleClose, open, isReceived }) {
  const [activeButton, setActiveButton] = useState('Token');
  const [selectedCard, setSelectedCard] = useState([]);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Scrollbar>
            {/* Modal part 1 */}

            {/* modal header */}

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Typography
                id='modal-modal-title'
                variant='h5'
                component='h2'
                sx={{
                  flexGrow: 1,
                  textAlign: 'center'
                }}
              >
                Counter Offer
              </Typography>

              <IconButton onClick={handleClose}>
                <Box component='img' src='/assets/svg/close.svg' />
              </IconButton>
            </Box>

            {/* custom tabs buttons */}

            {/* tabs map data */}

            <Box
              sx={{
                width: 160,
                background: (theme) => theme.palette.primary.main,
                borderRadius: '12px',
                px: 2,
                display: {
                  xs: 'none',
                  lg: 'flex'
                },
                justifyContent: 'space-between',
                alignItems: 'center',
                height: 46
              }}
            >
              <Typography variant='subtitle1'>Expiration</Typography>

              <Box
                component='img'
                src='/assets/svg/arrowDown.svg'
                sx={{
                  width: 10
                }}
              />
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(1 , 1fr)',
                  md: 'repeat(5, 1fr)'
                },
                gap: 2,
                justifyContent: 'space-between'
                // px: { xs: 2, md: 5.5 },
                // py: 5,
              }}
            >
              <Box
                sx={{
                  gridColumn: {
                    md: '1/3'
                  }
                }}
              >
                <Typography
                  sx={{
                    px: 2,
                    my: 2
                  }}
                >
                  You will provide
                </Typography>

                <OfferCard
                  title='Ethereum'
                  price='$1,212 USD'
                  value='Amount'
                  img='/assets/images/ethereum.png'
                  isDashboard
                />

                {/* {
  "extends": "next/core-web-vitals"
} */}

                <OfferCard
                  title='Ethereum'
                  price='$1,212 USD'
                  value='Amount'
                  img='/assets/images/ethereum.png'
                  isDashboard
                />

                {/* <MFileInput /> */}

                <Box
                  // onClick={handleOpenOffer}
                  sx={{
                    border: '0.3px dashed #FFFFFF',
                    borderRadius: '17px',
                    background: (theme) => theme.palette.primary.main,
                    py: 2,
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Typography variant='subtitle1'>
                    + Add new Token or NFT
                  </Typography>
                </Box>

                {/* <CreateToken handleClose={handleCloseOffer} open={openOffer} /> */}
              </Box>

              <Box
                sx={{
                  justifySelf: 'center',
                  mt: {
                    md: 16
                  }
                }}
              >
                <Button
                  variant='contained'
                  sx={{
                    py: 2,
                    transform: 'matrix(1, 0, 0, -1, 0, 0)',
                    borderRadius: 2
                  }}
                >
                  <Box
                    component='img'
                    src='/assets/svg/MyOtc.svg'
                    sx={{
                      width: 20
                    }}
                  />
                </Button>
              </Box>

              <Box
                sx={{
                  gridColumn: {
                    md: '4/6'
                  }
                }}
              >
                <Typography
                  sx={{
                    my: 2
                  }}
                >
                  You will receive
                </Typography>

                <OfferCard
                  title='Ethereum'
                  price='$1,212 USD'
                  value='Amount'
                  img='/assets/images/ethereum.png'
                  isDashboard
                />

                <Box
                  // onClick={handleOpenReceive}
                  sx={{
                    border: '0.3px dashed #FFFFFF',
                    borderRadius: '17px',
                    background: (theme) => theme.palette.primary.main,
                    py: 2,
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Typography variant='subtitle1' sx={{}}>
                    + Add new Token or NFT
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Scrollbar>
        </Box>
      </Modal>
    </div>
  );
}
