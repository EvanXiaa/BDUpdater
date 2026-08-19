v5.0.0
## [5.0.0] - 2024-05-11
### BREAKING CHANGES

#### Solhint EXIT codes
Solhint changed how the exit codes are implemented:

`Exit with 0 code` When execution was ok and there were no errors when evaluating the code according to the rules
`Exit with 1 code` When execution was ok and there are errors reported
`Exit with 1 code` When execution was ok and max warnings is lower than the reported warnings
`Exit with 255 code` When there's an error in the execution (bad config, writing not allowed, wrong parameter, file not found, etc)

#### Solhint QUIET mode
QUIET mode (-c quiet) option now works with the warnings and may exit with 1 if there are more than defined by user
<br><br><br>
Thanks to [@juanpcapurro](https://github.com/juanpcapurro) for providing the code