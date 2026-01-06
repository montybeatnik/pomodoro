from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import numpy as np
import simpleaudio as sa
import threading
import time

app = FastAPI()
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

class PomodoroSettings(BaseModel):
    work_time: int = 25 * 60  # 25 minutes in seconds
    break_time: int = 5 * 60  # 5 minutes in seconds

# Initialize Pomodoro settings
pomodoro_settings = PomodoroSettings()

# Sound frequencies for work and break
work_frequency = 440  # Hz (A4 note)
break_frequency = 660  # Hz (E5 note)

# Sound duration in seconds
sound_duration = 2

# Function to play a sound
def play_sound(frequency):
    sample_rate = 44100
    t = np.linspace(0, sound_duration, int(sample_rate * sound_duration), False)
    note = np.sin(frequency * t * 2 * np.pi)
    audio = note * (2**15 - 1) / np.max(np.abs(note))
    audio = audio.astype(np.int16)
    play_obj = sa.play_buffer(audio, 1, 2, sample_rate)
    play_obj.wait_done()

# Function to start the Pomodoro timer
def start_pomodoro(work_time, break_time):
    while True:
        # Work time
        play_sound(work_frequency)
        for i in range(work_time, 0, -1):
            time.sleep(1)
        
        # Break time
        play_sound(break_frequency)
        for i in range(break_time, 0, -1):
            time.sleep(1)

@app.get("/")
def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "work_time": pomodoro_settings.work_time // 60, "break_time": pomodoro_settings.break_time // 60})

@app.post("/start_timer")
def start_timer():
    threading.Thread(target=start_pomodoro, args=(pomodoro_settings.work_time, pomodoro_settings.break_time)).start()
    return {"message": "Timer started"}

@app.post("/update_settings")
def update_settings(settings: PomodoroSettings):
    global pomodoro_settings
    pomodoro_settings = settings
    return {"message": "Settings updated successfully"}