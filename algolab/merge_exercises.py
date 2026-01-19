# Read the original data file
with open('algolab-quiz-data.js.backup', 'r') as f:
    original = f.read()

# Read the new exercises (just the array content)
with open('exercises_to_add.js', 'r') as f:
    new_exercises = f.read()

# Find the last closing bracket and brace
last_brace = original.rfind('}')
# Add a comma after the last exercise
updated = original[:last_brace+1] + ',\n' + new_exercises + '];'

# Write the updated file
with open('algolab-quiz-data.js', 'w') as f:
    f.write(updated)

print("✅ Successfully merged exercises!")
