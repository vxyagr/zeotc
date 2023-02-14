/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';

import { Box } from '@mui/material';

export default function CustomNft() {
  const [tokenType, setTokenType] = useState('ERC20');

  return (
    <Box
      sx={{
        mt: 10,
      }}
    >
      <Box
        sx={{
          maxWidth: 300,
          mx: 'auto',
          '& input': {
            mb: 2,
            mt: 1,
          },
        }}
      >
        <label>Asset type</label>

        <Box
          component='select'
          type='text'
          placeholder='Asset Address'
          value={tokenType}
          onChange={(e) => setTokenType(e.target.value)}
          sx={{
            background: (theme) => theme.palette.primary.main,
            pr: 3,
            pl: 2,
            width: '100%',
            outline: 'none',
            border: 'none',
            borderRadius: '12px',
            height: 46,
            fontFamily: 'Poppins',
            mb: 2,
            mt: 1,
            option: {
              color: '#000',
              fontSize: '16px',
              fontWeight: 'bold',
            },
          }}
        >
          <option value='ERC20'>ERC20</option>

          <option value='ERC721'>ERC721</option>

          <option value='ERC1155'>ERC1155</option>
        </Box>

        <label>Address</label>

        <Box
          component='input'
          type='text'
          placeholder='Address'
          // value={newSearchInput}
          // onChange={(e) => setSearchInput(e.target.value)}
          sx={{
            background: (theme) => theme.palette.primary.main,
            px: 3,

            width: '100%',
            outline: 'none',
            border: 'none',
            borderRadius: '12px',

            height: 46,
            fontFamily: 'Poppins',
          }}
        />

        {tokenType !== 'ERC20' && (
          <>
            {' '}

            <label>ID</label>

            <Box
              component='input'
              type='text'
              placeholder='ID'
              // value={newSearchInput}
              // onChange={(e) => setSearchInput(e.target.value)}
              sx={{
                background: (theme) => theme.palette.primary.main,
                px: 3,

                width: '100%',
                outline: 'none',
                border: 'none',
                borderRadius: '12px',

                height: 46,
                fontFamily: 'Poppins',
              }}
            />
          </>
        )}
      </Box>
    </Box>
  );
}
