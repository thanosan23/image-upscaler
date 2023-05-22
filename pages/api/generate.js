export default async function handler(req, res) {
  const imageUrl = req.body.imageUrl;
  const token = process.env.REPLICATE_API_KEY;
  let response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + token,
    },
    body: JSON.stringify({
      version:
        "660d922d33153019e8c263a3bba265de882e7f4f70396546b6c9c8f9d47a021a",
      input: { image: imageUrl}
    }),
  });

  let jsonResponse = await response.json();
  console.log(jsonResponse);
  let url = jsonResponse.urls.get;

  let image = null;

  while(image == null) {
    let output = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + process.env.REPLICATE_API_KEY,
      },
    });
    let finalResponse = await output.json();
    if (finalResponse.status == "succeeded") {
      image =  finalResponse.output;
    } else if (finalResponse.status == "failed") {
      break;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  res.status(200).json(JSON.stringify({url:url}));
}
