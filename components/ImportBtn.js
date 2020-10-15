import { useRouter } from "next/router";
import axios from "axios";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

const ImportBtn = () => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const file = e.target.file.files[0];
    const name = file.name.slice(0, -4);

    var reader = new FileReader();

    reader.readAsText(file);

    reader.onload = async function (evt) {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/import/?name=${name}`,
        evt.target.result,
        {
          headers: {
            "Content-Type": "text/csv",
          },
        }
      );

      if (res.data.status === "ok") {
        setOpen(false);
        router.push({
          pathname: "/import",
          query: { id: res.data.id, name },
        });
      }
    };
  };

  return (
    <>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Import
      </Button>

      {/* popup for file uploading */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Import CSV</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <input required name="file" type="file" accept=".csv" />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="default">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Upload
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default ImportBtn;
