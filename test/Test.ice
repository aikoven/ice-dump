#pragma once

#include <Ice/BuiltinSequences.ice>

module Test {
    struct SomeStruct {
        bool boolVal;
    };

    class Base {
        int intVal;
        optional(1) SomeStruct optionalStruct;
    };

    class TestObj extends Base {
        string stringVal;
        Ice::StringSeq stringSeqVal;
        Base nestedObject;
        SomeStruct nestedStruct;
        optional(1) Ice::IntSeq optionalIntSeqVal;
    };

    sequence<SomeStruct> SomeStructSeq;
    sequence<Base> BaseSeq;

    dictionary<string, SomeStruct> SimpleDict;
    dictionary<SomeStruct, Base> ComplexDict;
};
