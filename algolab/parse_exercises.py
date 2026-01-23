import csv
import json

exercises = []

with open('exercises.csv', 'r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    for row in reader:
        exercise = {
            'name': row['Exercise Name'],
            'aka': row['AKA'],
            'week': row['Week'],
            'methods': row['Methods Used'],
            'status': row['Completion Status'],
            'problemModel': row['Problem Model'],
            'solutionShort': row['Solution short'],
            'solution': row['Solution'],
            'link': row['Exercise Link']
        }
        exercises.append(exercise)

with open('exercises-data.js', 'w', encoding='utf-8') as f:
    f.write('const EXERCISES = ')
    json.dump(exercises, f, indent=2, ensure_ascii=False)
    f.write(';\n')

print(f"Parsed {len(exercises)} exercises")
