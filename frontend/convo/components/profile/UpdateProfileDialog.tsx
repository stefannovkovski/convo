import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import UpdateProfileForm from "./UpdateProfileForm";

type UpdateProfileDialogProps = {
    open: boolean;
    onClose: () => void;
    initialData: {
        name: string;
        bio?: string;
        avatarUrl?: string;
    };
    onSave: (data: FormData | {
        name: string;
        bio?: string;
    }) => void;
};

export default function UpdateProfileDialog({
    open,
    onClose,
    initialData,
    onSave,
}: UpdateProfileDialogProps) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
                Edit Profile
                <IconButton onClick={onClose}>
                <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <UpdateProfileForm
                    initialData={initialData}
                    onSave={(data) =>{
                        onSave(data);
                        onClose();
                    }
                    }
                />
            </DialogContent>
            
        </Dialog>
    )
}
