v3.0.0-rc.0
Formats time and date-time now require timezone, as per JSON Schema specification / RFC3339.
Added formats iso-time and iso-date-time that have optional timezone, they can be used for backwards compatibility.
Keywords formatMaximum and formatMinimum for time and date-time format now take into account timezone (both for time and for date), the previous comparison logic that ignored timezone is preserved for iso-time and iso-date-time formats.