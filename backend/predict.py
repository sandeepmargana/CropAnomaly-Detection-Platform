from ultralytics import YOLO
import os
import uuid

# Load model once
model = YOLO("model/cotton_best_model.pt")

RESULT_FOLDER = "results"
os.makedirs(RESULT_FOLDER, exist_ok=True)


def predict(image_path):

    results = model(image_path)

    result = results[0]

    detections = []

    for box in result.boxes:

        cls = int(box.cls)

        conf = float(box.conf)

        x1, y1, x2, y2 = map(int, box.xyxy[0])

        detections.append(
            {
                "class": model.names[cls],
                "confidence": round(conf * 100, 2),
                "x1": x1,
                "y1": y1,
                "x2": x2,
                "y2": y2,
            }
        )

    filename = f"{uuid.uuid4().hex}.jpg"

    output_path = os.path.join(
        RESULT_FOLDER,
        filename
    )

    result.save(filename=output_path)

    return detections, output_path