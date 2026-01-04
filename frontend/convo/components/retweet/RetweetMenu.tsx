'use client';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import RepeatIcon from '@mui/icons-material/Repeat';
import EditIcon from '@mui/icons-material/Edit';

interface RetweetMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onRetweet: () => void;
  onQuote: () => void;
  isRetweeted: boolean;
}

export default function RetweetMenu({ anchorEl, open, onClose, onRetweet, onQuote, isRetweeted, }: RetweetMenuProps) 
{
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
    >
      <MenuItem
        onClick={() => {
          onRetweet();
          onClose();
        }}
      >
        <ListItemIcon>
          <RepeatIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>
          {isRetweeted ? 'Undo Retweet' : 'Retweet'}
        </ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => {
          onQuote();
          onClose();
        }}
      >
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Quote</ListItemText>
      </MenuItem>
    </Menu>
  );
}