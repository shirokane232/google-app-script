function threadMain() {
  refreshToken();
}

function refreshToken() {
  const domain = loadEnv()["CLOUDFLARE"];
  const threadSecrets = readRows("secrets").find((value) => {
    return value["id"] == "threads-user";
  });
  const now = new Date().getTime();
  const eightHoursInMilliseconds = 8 * 60 * 60 * 1000;
  if (now - threadSecrets.updatedAt > eightHoursInMilliseconds) {
    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(JSON.parse(threadSecrets.secrets)),
    };
    const url = `${domain}api/threads/auth/refresh-token`;
    try {
      const response = UrlFetchApp.fetch(url, options);
      const responseContent = response.getContentText();
      const responseData = JSON.parse(responseContent);
      const responseCode = response.getResponseCode();
      if (responseCode === 200) {
        console.log(JSON.stringify(responseData));
        threadSecrets.secrets = JSON.stringify(responseData);
        threadSecrets.updatedAt = now;
        updateForRecord("secrets", threadSecrets._row_index, threadSecrets);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
