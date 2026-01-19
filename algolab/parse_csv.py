import csv
import json

exercises = []

with open('algolab_quiz_bank_improved.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        # Extract complexity from solution or default to O(n)
        methods = row['Methods used for solution'].strip()
        
        # Determine problem type based on methods
        problem_type = "Algorithm Problem"
        if "DP" in methods or "Dynamic Programming" in methods:
            problem_type = "Dynamic Programming"
        elif "Greedy" in methods:
            problem_type = "Greedy Algorithm"
        elif "Shortest path" in methods or "Dijkstra" in methods:
            problem_type = "Shortest Path"
        elif "Geometry" in methods or "CGAL" in methods:
            problem_type = "Computational Geometry"
        elif "Matching" in methods:
            problem_type = "Maximum Matching"
        elif "Sliding window" in methods or "Two pointers" in methods:
            problem_type = "Two Pointers / Sliding Window"
        elif "Prefix sums" in methods:
            problem_type = "Prefix Sums"
        
        # Determine complexity (simplified estimation)
        complexity = "O(n)"
        if "O(n^2)" in row['Problem solution (key points)'] or "nested" in row['Problem solution (key points)'].lower():
            complexity = "O(n^2)"
        elif "O(n log n)" in row['Problem solution (key points)'] or "sort" in row['Problem solution (key points)'].lower():
            complexity = "O(n log n)"
        elif "Dijkstra" in methods:
            complexity = "O((V + E) log V)"
        elif "DP" in methods or "Dynamic Programming" in methods:
            complexity = "O(n * m)"
        
        exercise = {
            "name": row['Name of the exercise'],
            "week": "Mixed",
            "methods": methods,
            "complexity": complexity,
            "description": row['Problem description'][:200] + "..." if len(row['Problem description']) > 200 else row['Problem description'],
            "solution": row['Problem solution (key points)'][:300] + "..." if len(row['Problem solution (key points)']) > 300 else row['Problem solution (key points)'],
            "cppFile": "",
            "officialLink": "",
            "problemType": problem_type,
            "keyInsight": row['Problem solution (key points)'].split('.')[0] if '.' in row['Problem solution (key points)'] else row['Problem solution (key points)'][:100]
        }
        exercises.append(exercise)

# Output as JavaScript array
print("const newExercises = [")
for i, ex in enumerate(exercises):
    comma = "," if i < len(exercises) - 1 else ""
    print(f"  {{")
    print(f"    name: {json.dumps(ex['name'])},")
    print(f"    week: {json.dumps(ex['week'])},")
    print(f"    methods: {json.dumps(ex['methods'])},")
    print(f"    complexity: {json.dumps(ex['complexity'])},")
    print(f"    description: {json.dumps(ex['description'])},")
    print(f"    solution: {json.dumps(ex['solution'])},")
    print(f"    cppFile: {json.dumps(ex['cppFile'])},")
    print(f"    officialLink: {json.dumps(ex['officialLink'])},")
    print(f"    problemType: {json.dumps(ex['problemType'])},")
    print(f"    keyInsight: {json.dumps(ex['keyInsight'])}")
    print(f"  }}{comma}")
print("];")
