# Installation

The installation of the web application to be ran locally requires you to complete the following steps:

1. First ensure you have the latest version of Python and NodeJs installed on your device. You can find installation details: Python (https://www.python.org/downloads/), Node (https://nodejs.dev/download).

2. Ensure you have the latest version of ‘virtualenv’ installed in your Python packages. You can find documentation at (https://virtualenv.pypa.io/en/latest/user_guide.html).

3. Download and unzip the application onto your desktop.

4. Open the terminal and navigate to the root directory of the application (/code). 

5. Using the ‘virtualenv’ documentation for your operating system, create an environment inside the root directory and activate it. 

6. With the environment active, in the code or text editor of your choice open the file at path (code/backend/dependencies.txt) and pip install all the required python dependencies into your virtual environment. 

7. You then need to create your own version of a test database (an overall test database is currently under construction to be used in the application). Add a file db.sqlite3 file into the root backend folder '/backend'.

8. Then create a .env file and store this in the '/backend' folder. You then need to generate a django secret key and store is as  SECRET_KEY inside .env. You also need to create DEBUG variable and set it to false. 

9. in the terminal execute 'python manage.py createsuperuser' and follow the instructions to create your own super user for access to the new database instance.

10. Open a second terminal and navigate into the frontend folder of the application (code/frontend).

11. Run npm install inside this folder to install all JavaScript package dependencies. 

    

#  Run 

First ensure both port 3000 and port 8000 are open and available on your local host. This application was developed and tested primarily with chrome but has been tested on all common browsers: Edge, Safari and FireFox. 

 

Once all necessary dependencies have been installed, open a terminal and navigate to the root directory of the project. Again following the documentation for virtualenv, whichever method is appropriate for your operating system activate the virtual environment. Navigate to the backend folder (code/backend) and execute the command ‘python manage.py runserver’, the application should now be running on port 8000 at (http://127.0.0.1:8000/admin/login/?next=/admin/). You can now access the database instance and begin to add your dummy data. To re iterate a test database is currently in the works for this application. 

 

To open the React application, open a second terminal and navigate to the frontend folder in the base application directory (code/frontend). From here, ensuring node.js is installed, run ‘npm start’. The application will now load at (http://localhost:3000/) on your default browser, if you wish to open in another browser open the link with the chosen browser.