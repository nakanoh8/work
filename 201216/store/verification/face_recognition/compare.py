import face_recognition

picture_of_obama = face_recognition.load_image_file("/usr/src/app/images/1.jpg")
obama_face_encoding = face_recognition.face_encodings(picture_of_obama)[0]

biden_picture = face_recognition.load_image_file("/usr/src/app/images/2.jpg")
biden_face_encoding = face_recognition.face_encodings(biden_picture)[0]

results = face_recognition.compare_faces([obama_face_encoding], biden_face_encoding)
print(results)
results2 = face_recognition.face_distance([obama_face_encoding], biden_face_encoding)
print(results2)

# python3 src/compare.py models/20180402-114759 /usr/src/app/images/1.jpg /usr/src/app/images/2.jpg