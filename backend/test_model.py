from ultralytics import YOLO

model = YOLO("backend/model/cotton_best_model.pt")

print(model.names)