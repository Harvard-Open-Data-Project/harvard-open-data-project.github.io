import sys
sys.path.append("../")
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import server.auth as auth
import datetime

# Fill in as outcomes come in? Keys should be form fields, values should all be either 0 or 100
realized_outcomes = {}

def update_predictions(email, form, questions, db):
    valid_form_names = [item["name"] for item in questions]
    user_info_ref = db.collection("prediction_users").document(email)
    for field in form:
        if field in valid_form_names:
            # update documents under the user's predictions subcollection
            question_ref = user_info_ref.collection("predictions").document(field)
            question_ref.set({
                "guess": int(form[field])
            })

def calculate_points(prediction, outcome):
    """
    Adjusted version of the Brier scoring function, as described at
    https://fivethirtyeight.com/features/how-to-play-our-nfl-predictions-game/
    """
    diff = (prediction - outcome) / 100
    brier_score = diff ** 2
    adjusted_score = -(brier_score - 0.25) * 200
    return round(adjusted_score, 2)

def update_user_score(email, db):
    """ Update a single user's score """
    user_info_ref = db.collection("prediction_users").document(email)
    predictions_dict = auth.get_predictions_dict(email, db)
    score = 0
    for question, outcome in realized_outcomes:
        if question in predictions_dict:
            prediction = predictions_dict[question]
            score += calculate_points(prediction, outcome)
    user_info_ref.update({
        u"current_score" : score
    })

def update_all_scores(db):
    """ Update all users' scores. """
    prediction_users_ref = db.collection("prediction_users")
    user_docs = prediction_users_ref.stream()
    for user_doc in user_docs:
        update_user_score(user_doc.id, db)
    print("all scores updated")