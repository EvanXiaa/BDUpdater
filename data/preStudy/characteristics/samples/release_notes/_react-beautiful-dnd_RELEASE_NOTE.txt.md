Will my app break with 12.0?
For most people: you can safely upgrade to 12.0! 🎉 If you are doing any of the following then you will need to change some things. This is just a super quick reference to see if you can upgrade safely.

Patching onKeyDown, onMouseDown or onTouchStart in DragHandleProps. These event handlers have been removed to support our new sensor approach, and ultimately for good cloning and virtual list support.
We have renamed our data-* attributes. So if you were using them (perhaps in a test), then things will break for you
We are no longer using aria-roledescription for lift instructions. Please now use <DragDropContext /> | liftInstruction
Using @atlaskit/tree 🌲 or something similar? You will need to stay on 11.x for now
More details on these changes are provided below ↓.