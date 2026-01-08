import { PostResponseDto } from "@/types/post/PostResponseDto";
import { Avatar, Box, Button, Dialog, DialogContent, IconButton, TextField, Typography } from "@mui/material";
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';


interface EditPostDailogProps {
    open: boolean;
    onClose: () => void;
    post: PostResponseDto;
    onEdit: (postId:number, data: { content: string}) => void;
}

export default function EditPostDialog({
    open, onClose, post, onEdit} : EditPostDailogProps){

    const [content, setContent] = useState(post.content);

    const handleSubmit = () => {
        if(!content.trim()) return;
        onEdit(post.id, { content });
        onClose();
    }

    const handleClose = () => {
        setContent(post.content);
        onClose();
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogContent sx={{ p:0 }}>
                <Box
                sx={{
                    display:'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1,
                    borderBottom: 1,
                    borderColor: 'divider',
                }}>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" fontWeight={700}>
                        Edit Post
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!content.trim()}
                        sx= {{
                            borderRadius: 3,
                            textTransform: 'none',
                            fontWeight: 700,
                            px: 3,
                        }}>
                        Save
                    </Button>
                </Box>
                <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Avatar
                    sx={{ width: 48, height: 48 }}
                    src={`${process.env.NEXT_PUBLIC_API_URL}${post.author.avatar}`}
                    />
                    <Box sx={{ flex:1 }}>
                        <TextField
                            fullWidth
                            multiline
                            autoFocus
                            placeholder="What's happening?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            variant="standard"
                            InputProps={{
                            disableUnderline: true,
                            sx: {
                                fontSize: '1.25rem',
                                '& textarea': {
                                '&::placeholder': {
                                    opacity: 0.6,
                                },
                                },
                            },
                            }}
                            sx={{ mb: 2 }}
                        />

                        {post.imageUrl && (
                            <Box sx={{ mb:2 }}>
                                <img
                                    src={`${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`}
                                    alt="Post image"
                                    style={{ maxWidth: '100%', borderRadius: 8 }}
                                />
                            </Box>
                        )}

                    </Box>
                </Box>
            </Box>
        </DialogContent>
    </Dialog>
)
}