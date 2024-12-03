import app from "./app";
const port = process.env.PORT || 4006;

const startApplication = async () => {
  try {
    app.listen(port, () => {
      console.log(`Listening: http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startApplication();
