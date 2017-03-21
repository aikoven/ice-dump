#pragma once

#include <Ice/BuiltinSequences.ice>

module Test {
    struct SomeStruct {
        bool boolVal;
    };

    class Base {
        int intVal;
    };

    class TestObj extends Base {
        string stringVal;
        Ice::StringSeq stringSeqVal;
        Base nestedObject;
        SomeStruct nestedStruct;
    };
};