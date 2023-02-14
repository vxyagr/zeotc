import { useEffect, useState } from 'react';

import { Box, Typography, Button } from '@mui/material';
import { useWeb3Modal } from '@web3modal/react';
import { useAccount } from 'wagmi';

import { conciseAddress } from 'helpers/utilities';
import useWalletConnector from 'hooks/useWalletConnector';

function WalletConnectButton({ title, }) {
  const [isDefinitelyConnected, setIsDefinitelyConnected] = useState(false);
  const { open, } = useWeb3Modal();
  const account = useAccount();
  const { onConnect, onDisconnect, } = useWalletConnector(); // new wallet

  useEffect(() => {
    if (account?.isConnected) {
      setIsDefinitelyConnected(true);
      onConnect();
    } else {
      setIsDefinitelyConnected(false);
    }
  }, [account?.isConnected, onConnect]);

  return (
    <Box>
      <Box
        onClick={async () =>
          isDefinitelyConnected ? await onDisconnect() : await open()
        }
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          background: account?.isConnected
            ? (theme) => theme.palette.info.main
            : 'linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #460AE4 100%)',
          // bgcolor:'red'
          cursor: 'pointer',
          px: isDefinitelyConnected ? 1 : 2,
          py: isDefinitelyConnected ? 2 : 1.5,
          borderRadius: '12px',
        }}
      >
        {isDefinitelyConnected && (
          <Box
            component='img'
            src='/assets/svg/wallet.svg'
            sx={{
              width: 20,
              height: 16,
            }}
          />
        )}

        <Typography
          sx={{
            fontSize: 14,
          }}
        >
          {isDefinitelyConnected
            ? conciseAddress(account?.address)
            : 'Connect Wallet'}
        </Typography>

        {isDefinitelyConnected && (
          <Box
            component='img'
            src='/assets/svg/arrowDown.svg'
            sx={{
              width: 10,
            }}
          />
        )}
      </Box>

      {/* <Button>connect</Button> */}
    </Box>
  );
}

export default WalletConnectButton;
