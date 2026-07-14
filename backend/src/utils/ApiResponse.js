class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.status = statusCode < 400 ? "success" : "error";
  }

  send(res) {
    res.status(this.statusCode).json({
      success: this.status === "success",
      message: this.message,
      data: this.data,
    });
  }
}

export { ApiResponse };
