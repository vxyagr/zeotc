import React, { useState, useEffect, useMemo } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Fuse from 'fuse.js';
import debounce from 'lodash.debounce';

import ERC20List from '../../public/assets/json/curatedErc20.json';
import NFTList from '../../public/assets/json/curatedNFTs.json';
import { MOST_COMMON_ERC20, MOST_COMMON_NFT } from '../constant';

const mappingListAssets = {
  Token: {
    common: MOST_COMMON_ERC20[process.env.NEXT_PUBLIC_CHAIN],
    allList: ERC20List.tokens
  },
  NFTs: {
    common: MOST_COMMON_NFT,
    allList: NFTList.tokens
  }
};

const SearchAssets = ({ assetType, onSearchAssetAddress }) => {
  const [listOptions, setListOptions] = useState(
    mappingListAssets[assetType].common
  );

  useEffect(() => {
    setListOptions(mappingListAssets[assetType].common);
  }, [assetType]);

  const AssetListRender = (props, option) => {
    return (
      <ListItem {...props}>
        <ListItemIcon>
          <Avatar alt={option.name} src={option.logoURI} />
        </ListItemIcon>

        <ListItemText
          primary={option.symbol}
          secondary={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <Typography
              sx={{ display: 'inline' }}
              component='span'
              variant='body2'
              color='text.primary'
            >
              {option.name}
            </Typography>
          }
        />
      </ListItem>
    );
  };

  const handleSearch = (data) => {
    const { value } = data.target;

    if (value) {
      const options = {
        threshold: 0.1,
        keys: ['name', 'symbol']
      };
      const fuse = new Fuse(mappingListAssets[assetType].allList, options);

      const result = fuse.search(value).map((asset) => asset.item);
      setListOptions(result);
    } else {
      setListOptions(mappingListAssets[assetType].common);
    }
  };

  const debouncedSearchChange = useMemo(() => debounce(handleSearch, 700), []);

  const handleSelectAssets = (_, value) => {
    if (value?.address) {
      onSearchAssetAddress(value.address);
    }
  };

  return (
    <Autocomplete
      disablePortal
      id='combo-box-demo'
      options={listOptions}
      filterOptions={(x) => x}
      onInputChange={debouncedSearchChange}
      onChange={handleSelectAssets}
      getOptionLabel={(e) => e.name}
      sx={{
        background: (theme) => theme.palette.primary.main,
        // px: 3,
        maxWidth: {
          xs: '100%',
          sm: 260
        },
        width: '100%',
        outline: 'none',
        border: 'none',
        borderRadius: '12px',
        ml: {
          sm: 3
        },
        height: 46,
        fontFamily: 'Poppins'
      }}
      renderOption={AssetListRender}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder='search by name or address'
          sx={{
            '& .MuiOutlinedInput-root': {
              paddingTop: '0px'
            },
            '& .MuiOutlinedInput-input': {
              color: 'gray',
              fontSize: '14px',
              mt: '5px'
            }
          }}
        />
      )}
    />
  );
};

export default SearchAssets;
