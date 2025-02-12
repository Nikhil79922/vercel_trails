const getResetPasswordEmail = (link) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
</head>
<body style="background-color: #f4f4f4;
             display: flex;
             justify-content: center;
             align-items: center;
             min-height: 100vh;
             margin: 0;
             font-family: 'Arial', sans-serif;">

    <!-- Email Container -->
    <div style="background: #ffffff;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                max-width: 480px;
                width: 90%;
                text-align: center;
                border: 1px solid #e0e0e0;">

        <h1 style="font-size: 24px;
                   font-weight: 700;
                   color: #333;
                   margin-bottom: 18px;">
            Reset Your Password
        </h1>

        <p style="color: #555;
                  font-size: 15px;
                  font-weight: 400;
                  margin-bottom: 26px;
                  line-height: 1.6;">
            We received a request to reset your password. Click the button below to proceed.
        </p>

        <!-- Action Button -->
        <a href="${link}" style="display: inline-block;
                                background: #128EC4;
                                color: #ffffff;
                                font-weight: 600;
                                padding: 12px 24px;
                                border-radius: 8px;
                                text-decoration: none;
                                font-size: 16px;
                                box-shadow: 0 3px 10px rgba(0, 123, 255, 0.3);
                                transition: all 0.3s ease-in-out;">
            Reset Password
        </a>

        <hr style="border: 0;
                   border-top: 1px solid #ddd;
                   margin: 24px 0;">

        <p style="color: #777;
                  font-size: 13px;
                  font-weight: 400;
                  line-height: 1.5;">
            If you didn’t request a password reset, you can ignore this email.
        </p>
    </div>

    <style>
        /* Button Hover Effect */
        a:hover {
            background: #0056b3;
            box-shadow: 0 5px 15px rgba(0, 123, 255, 0.4);
        }
    </style>

</body>
</html>

`;

module.exports = { getResetPasswordEmail };
