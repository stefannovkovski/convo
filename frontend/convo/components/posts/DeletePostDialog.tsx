import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";


interface DeletePostDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeletePostDialog({
    open, onClose, onConfirm}: DeletePostDialogProps){
    
    const handleConfirm = () => {
        onConfirm();
        onClose();
    }


  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Delete post?</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary">
          This can't be undone and it will be removed from your profile, the
          timeline of any accounts that follow you, and from search results.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 700,
            flex: 1,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 700,
            flex: 1,
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
    
}