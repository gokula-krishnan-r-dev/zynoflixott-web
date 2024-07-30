import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "@/lib/axios";
import { accessToken, userId } from "@/lib/user";
import { useState } from "react";
import Loading from "../ui/loading";
import { toast } from "sonner";

export function UpdateImg({ button, id, name, refetch }: any) {
  const [pic, setPic] = useState<File | any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setPic(file);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    if (pic) {
      formData.append(name, pic);
    }

    const response = await axios.put(`/auth/user/${userId}`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,

        "Content-Type": "multipart/form-data",
      },
    });
    refetch();
    if (response.status === 200) {
      toast.success("Profile picture updated successfully");
      refetch();
    }
    setLoading(false);
  };

  if (loading)
    return <Loading className="flex items-center justify-center h-full" />;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* <Button variant="outline">Edit Profile</Button> */}
        {button}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right capitalize">
              {name}
            </Label>
            <Input
              type="file"
              onChange={handleFileChange}
              name={name}
              id={id}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} type="submit">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
