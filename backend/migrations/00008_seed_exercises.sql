-- +goose Up
INSERT INTO exercises (name, category, muscle_group, equipment, description) VALUES
-- Strength: Chest
('Barbell Bench Press',    'Strength', 'Chest',     'Barbell',    'Compound press lying on a bench; primary chest builder.'),
('Dumbbell Bench Press',   'Strength', 'Chest',     'Dumbbells',  'Bench press with dumbbells for greater range of motion.'),
('Incline Bench Press',    'Strength', 'Chest',     'Barbell',    'Targets upper chest by setting bench to 30-45 degrees.'),
('Cable Fly',              'Strength', 'Chest',     'Cable',      'Isolation fly using cables for constant tension.'),
-- Strength: Back
('Barbell Deadlift',       'Strength', 'Back',      'Barbell',    'Hip-hinge compound lift; trains entire posterior chain.'),
('Pull-Up',                'Strength', 'Back',      'Bodyweight', 'Vertical pull using bodyweight; targets lats and biceps.'),
('Barbell Row',            'Strength', 'Back',      'Barbell',    'Horizontal row that targets mid-back and rear delts.'),
('Lat Pulldown',           'Strength', 'Back',      'Cable',      'Cable pulldown mimicking pull-up motion.'),
-- Strength: Legs
('Barbell Back Squat',     'Strength', 'Legs',      'Barbell',    'Compound squat with bar on upper back; primary quad/glute builder.'),
('Romanian Deadlift',      'Strength', 'Legs',      'Barbell',    'Hip hinge with slight knee bend; targets hamstrings and glutes.'),
('Leg Press',              'Strength', 'Legs',      'Machine',    'Machine compound push; allows high volume with less spinal load.'),
('Walking Lunge',          'Strength', 'Legs',      'Dumbbells',  'Unilateral leg exercise improving balance and quad strength.'),
-- Strength: Shoulders
('Overhead Press',         'Strength', 'Shoulders', 'Barbell',    'Standing or seated press; primary shoulder strength movement.'),
('Lateral Raise',          'Strength', 'Shoulders', 'Dumbbells',  'Isolation for lateral deltoid to build shoulder width.'),
-- Strength: Arms
('Barbell Curl',           'Strength', 'Arms',      'Barbell',    'Bicep isolation with straight bar.'),
('Tricep Pushdown',        'Strength', 'Arms',      'Cable',      'Cable pushdown for tricep isolation.'),
-- Cardio
('Running',                'Cardio',   'Full Body',  NULL,         'Steady-state or interval running for cardiovascular fitness.'),
('Rowing Machine',         'Cardio',   'Full Body',  'Machine',    'Full-body cardio on an ergometer; low joint impact.'),
('Jump Rope',              'Cardio',   'Full Body',  'Jump Rope',  'High-intensity cardio; improves coordination and conditioning.'),
('Cycling',                'Cardio',   'Legs',       'Bike',       'Steady-state or interval cycling; low impact on joints.'),
-- Mobility
('Hip Flexor Stretch',     'Mobility', 'Hips',       NULL,         'Kneeling lunge stretch to open hip flexors after sitting.'),
('Thoracic Rotation',      'Mobility', 'Back',       NULL,         'Seated or quadruped rotation to restore upper-back mobility.'),
('90/90 Hip Stretch',      'Mobility', 'Hips',       NULL,         'Seated hip rotation stretch targeting internal and external rotation.');

-- +goose Down
DELETE FROM exercises WHERE name IN (
    'Barbell Bench Press', 'Dumbbell Bench Press', 'Incline Bench Press', 'Cable Fly',
    'Barbell Deadlift', 'Pull-Up', 'Barbell Row', 'Lat Pulldown',
    'Barbell Back Squat', 'Romanian Deadlift', 'Leg Press', 'Walking Lunge',
    'Overhead Press', 'Lateral Raise', 'Barbell Curl', 'Tricep Pushdown',
    'Running', 'Rowing Machine', 'Jump Rope', 'Cycling',
    'Hip Flexor Stretch', 'Thoracic Rotation', '90/90 Hip Stretch'
);
