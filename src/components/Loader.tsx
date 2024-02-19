import { CircularProgress, Container, Stack } from "@mui/material"

const Loader = () => {
  return (

      <Stack justifyContent={"center"} alignItems={"center"} height={"85vh"}>
    <CircularProgress size={"10rem"}/>
      </Stack>

  )
}

export default Loader