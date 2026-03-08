# Minimal ProGuard rules to satisfy build when no custom rules are needed
# Keep lines intentionally minimal; add project-specific rules as required.

# Prevent obfuscation of Kotlin metadata
-keepclassmembers class kotlin.Metadata { *; }
