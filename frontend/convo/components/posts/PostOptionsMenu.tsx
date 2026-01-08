import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface PostOptionsMenuProps {
    anchorEl: null | HTMLElement;
    open: boolean;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export default function PostOptionsMenu({
    anchorEl, open, onClose, onEdit, onDelete
}: PostOptionsMenuProps){

    const handleEdit = () => {
        onEdit();
        onClose();
    }

    const handleDelete = () => {
        onDelete();
        onClose();
    }

    return (
   <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
        <MenuItem onClick={handleEdit}>
            <ListItemIcon>
                <EditIcon fontSize="small"/>
            </ListItemIcon>
            <ListItemText>
                Edit
            </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main'}}>
            <ListItemIcon>
                <DeleteIcon fontSize="small" color="error"/>
            </ListItemIcon>
            <ListItemText>
                Delete
            </ListItemText>
        </MenuItem>

    </Menu>
    )
}