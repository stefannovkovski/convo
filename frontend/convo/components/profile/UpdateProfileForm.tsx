import { Avatar, Box, Button, IconButton, TextField } from "@mui/material";
import { useRef, useState } from "react";
import ImageIcon from '@mui/icons-material/Image';

type UpdateProfileFormProps = {
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
export default function UpdateProfileForm({
  initialData,
  onSave,
}: UpdateProfileFormProps) {
    const [name, setName] = useState(initialData.name);
    const [bio, setBio] = useState(initialData.bio || '');
    const [avatar, setAvatar] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = () => {
        if (avatar) {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('bio', bio);
        formData.append('avatar', avatar);
        onSave(formData);
        } else {
        onSave({ name, bio });
        }
    };
      return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          src={avatar ? URL.createObjectURL(avatar) : `${process.env.NEXT_PUBLIC_API_URL}${initialData.avatarUrl}`}
          sx={{ width: 64, height: 64 }}
        />
        <IconButton onClick={() => fileInputRef.current?.click()}>
          <ImageIcon />
        </IconButton>
        <input
          hidden
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files?.[0] || null)}
        />
      </Box>

      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
      />

      <TextField
        label="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        fullWidth
        multiline
        rows={3}
      />

      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{ alignSelf: 'flex-end', fontWeight: 700 }}
      >
        Save
      </Button>
    </Box>
  );
}